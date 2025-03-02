import React from 'react';
import {Link, hashHistory} from 'react-router';
import Loader from './loader.jsx';
import Alert from 'react-s-alert';
import errorHandler from '../errorHandler';

class ViewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.state = {article: {}, loading: true, user: false};
  }

  componentDidUpdate() {
    if (this.props.location.query.new) {
      $('#myModal').modal('show');
    }
  }

  componentDidMount() {
    var myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    fetch('/api/articles/' + this.props.params.articleId, myInit)
      .then(response => response.json())
      .then(response => {
        if (response.error.error)
          errorHandler(response);
        else {
          this.setState({article: response.data})
        }
        this.setState({loading: false})
      });
  }

  deleteArticle(e) {
    e.preventDefault();
    var myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = {
      method: 'DELETE',
      headers: myHeaders,
      body: "id=" + this.state.article.id
    };
    var that = this;
    fetch('/api/articles/', myInit)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.error.error)
          errorHandler(response);
        else {
          Alert.success("Article has been deleted");
          hashHistory.push('home');

        }
      });
  }

  getRawMarkupBody() {
    return {__html: this.state.article.body};
  }


  render() {
    if (this.state.loading)
      return <Loader/>;
    else if (this.state.article && this.state.article.topic && this.state.article.user) {
      const {article} = this.state;
      const role = window.localStorage.getItem('userRole');

      return (<div>
          <div className="row">
            <div className="col-md-9">
              <div className="article-heading">
                <h1 className="single-article-title">{article.title}
                </h1>
                <div className="single-article-meta">
                  Last updated on {new Date(article.updated_at.replace(' ', 'T')).toDateString()}
                </div>
              </div>
              <div className="single-article-body"
                   dangerouslySetInnerHTML={this.getRawMarkupBody()}>
              </div>
            </div>
            <div className="col-md-3 article-sidebar">
              <div className="sidebar-block">
                <div className="sidebar-title">Filed under</div>
                <h2 className="color-text"><b>{article.topic.name}</b></h2>
              </div>
              <div className="sidebar-block">
                <div className="sidebar-title">Last Updated By</div>
                <h3><b>{article.user.name}</b></h3>
                <p>{article.user.about}</p>
              </div>
              <div className="sidebar-block">
                <div className="sidebar-title">What Changed in last edit</div>
                {(article.what_changed) ? <h4>{article.what_changed}</h4> : <h4>No information available</h4>}
              </div>
              {(role === 'admin') ? (
                <div>
                  <Link to={'/article/edit/' + article.id} className="btn btn-default btn-block btn-lg">Edit</Link>
                  <Link to={'/article/history/' + article.id}
                        className="btn btn-default btn-block btn-lg">History</Link>
                  <button className="btn btn-default btn-block btn-lg" onClick={this.deleteArticle}>Delete</button>
                </div>
              ) : ''}
            </div>
          </div>

          <div className="modal modal-fullscreen fade" id="myModal" tabIndex="-1" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                    aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body">
                  <center>
                    <div className="row">

                      <div className="col-md-6 col-sd-12">
                        <h1><b>Yayyyy!</b></h1><h3>Your article has been published</h3>
                        <br/>
                        <br/>
                        <button type="button" className="btn btn-default btn-block btn-lg" data-dismiss="modal">That's
                          great
                        </button>
                      </div>
                    </div>
                  </center>
                </div>

              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ViewArticle;
