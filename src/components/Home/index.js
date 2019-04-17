import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
});


const onClickTag = (tag, pager, payload) => ({ type: APPLY_TAG_FILTER, tag, pager, payload });
const onLoad = (tab, pager) => dispatch => {
  // const promise1 = new Promise(agent.Tags.getAll());
  // const promise1 = new Promise(pager);
  return Promise.all([agent.Tags.getAll(), pager()]).then((payload) => {
    dispatch({ type: HOME_PAGE_LOADED, tab, pager,  payload});
  });
};
const onUnload = () => ({ type: HOME_PAGE_UNLOADED });


const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    onClickTag,
    onLoad,
    onUnload,
  }, dispatch);
};

class Home extends React.Component {
  componentWillMount() {
    const tab = this.props.currentUser ? 'feed' : 'all';
    const articlesPromise = this.props.currentUser ?
      agent.Articles.feed :
      agent.Articles.all;

    this.props.onLoad(tab, articlesPromise);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        <Banner token={this.props.token} appName={this.props.appName} />

        <div className="container page">
          <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={this.props.tags}
                  onClickTag={this.props.onClickTag} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
