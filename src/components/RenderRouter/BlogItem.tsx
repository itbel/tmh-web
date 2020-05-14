
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'reactstrap';
import PropTypes from "prop-types";
import { withCookies } from 'react-cookie';
import "./BlogItem.scss"
import * as queries from '../../graphql/queries';
import Amplify, { API } from 'aws-amplify';
import awsmobile from '../../aws-exports';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api/lib/types';

//import uuidv4 from 'uuid/v4'
Amplify.configure(awsmobile);

interface Props extends RouteComponentProps {
    content: any,
    cookies: any
}
interface State {
    content: any,
    selection: string | null
    listData: any,
    teachingId: any,
    overlayData: any
}
class BlogItem extends React.Component<Props, State> {

    static contextTypes = {
        router: PropTypes.object,
        history: PropTypes.object
    }

    constructor(props: Props, context: any) {
        super(props, context);
        console.log(context);
        const { cookies } = props;
        if (cookies.get(this.props.content.group) == null)
            cookies.set(this.props.content.group, this.props.content.options[0], { path: '/' });
        var teachingId = this.props.content.options.length<=1?0:this.props.content.options.indexOf(cookies.get(this.props.content.group))
        this.state = {
            content: props.content,
            selection: cookies.get(this.props.content.group),
            teachingId: teachingId,
            listData: null,
            overlayData: null
        }
        if (this.props.content.class === "teaching-sunday") {
            const getVideoByVideoType:any = API.graphql({
                query: queries.getVideoByVideoType,
                variables: { sortDirection: this.state.content.sortOrder, limit: 2, videoTypes: this.state.content.subclass, publishedDate: { lt: "a" } },
                authMode: GRAPHQL_AUTH_MODE.API_KEY
            });
            getVideoByVideoType.then((json: any) => {
                console.log("Success queries.getVideoByVideoType: " + json);
                console.log(json)
                this.setState({
                    listData: json.data.getVideoByVideoType.items
                })
            }).catch((e: any) => { console.log(e) })
        }
        else if (this.props.content.class === "bbq") {
            const getVideoByVideoType:any = API.graphql({
                query: queries.getVideoByVideoType,
                variables: { sortDirection: this.state.content.sortOrder, limit: 2, videoTypes: this.state.content.subclass, publishedDate: { lt: "a" } },
                authMode: GRAPHQL_AUTH_MODE.API_KEY
            });
            getVideoByVideoType.then((json: any) => {
                console.log("Success queries.getVideoByVideoType: " + json);
                console.log(json)
                this.setState({
                    listData: json.data.getVideoByVideoType.items
                })
            }).catch((e: any) => { console.log(e) })
        }
        else if (this.props.content.class === "teaching-kids-youth") {
            console.log("teaching-kids-youth")
            const getVideoByVideoType1:any = API.graphql({
                query: queries.getVideoByVideoType,
                variables: { sortDirection: this.state.content.sortOrder, limit: 1, videoTypes: "ky-kids", publishedDate: { lt: "a" } },
                authMode: GRAPHQL_AUTH_MODE.API_KEY
            });
            const getVideoByVideoType2:any = API.graphql({
                query: queries.getVideoByVideoType,
                variables: { sortDirection: this.state.content.sortOrder, limit: 1, videoTypes: "ky-jrhigh", publishedDate: { lt: "a" } },
                authMode: GRAPHQL_AUTH_MODE.API_KEY
            });
            const getVideoByVideoType3:any = API.graphql({
                query: queries.getVideoByVideoType,
                variables: { sortDirection: this.state.content.sortOrder, limit: 1, videoTypes: "ky-youth", publishedDate: { lt: "a" } },
                authMode: GRAPHQL_AUTH_MODE.API_KEY
            });
            const getVideoByVideoType4:any = API.graphql({
                query: queries.getVideoByVideoType,
                variables: { sortDirection: this.state.content.sortOrder, limit: 1, videoTypes: "ky-srhigh", publishedDate: { lt: "a" } },
                authMode: GRAPHQL_AUTH_MODE.API_KEY
            });
            getVideoByVideoType1.then((json1: any) => {
                console.log({"Success queries.getVideoByVideoType: " :json1});
                this.setState({
                    listData: json1.data.getVideoByVideoType.items
                })
                getVideoByVideoType2.then((json2: any) => {
                    console.log({"Success queries.getVideoByVideoType: " : json2});
                    this.setState({
                        listData: this.state.listData.concat(json2.data.getVideoByVideoType.items)
                    })
                    getVideoByVideoType3.then((json3: any) => {
                        console.log({"Success queries.getVideoByVideoType: " : json3});
                        this.setState({
                            listData: this.state.listData.concat(json3.data.getVideoByVideoType.items)
                        })
                        getVideoByVideoType4.then((json4: any) => {
                            console.log({"Success queries.getVideoByVideoType: " : json4});
                            this.setState({
                                listData: this.state.listData.concat(json4.data.getVideoByVideoType.items)
                            })
                        }).catch((e: any) => { console.log(e) })
                    }).catch((e: any) => { console.log(e) })
                }).catch((e: any) => { console.log(e) })
            }).catch((e: any) => { console.log(e) })
        }
    }
    videoOverlayClose() {
        this.setState({
            overlayData: null

        })
    }
    handleClick(data: any) {
        this.setState({
            overlayData: data

        })
    }

    navigateUrlNewWindow(to: string) {
        window.open(
          to,
          '_blank' // <- This is what makes it open in a new window.
        );
      }
    
    render() {
       
        if (this.state.content.style === "hero") {
            console.log(this.props.content.class)
            return (
                this.state.listData !== null ?
                    (this.state.listData.length === this.props.content.options.length) || (this.props.content.options.length === 0) ?
                        <div className="blog" >
                            
                            <h1 className="blog-h1" >{this.props.content.header1}</h1>
                            <div className="blog-blackbox" >
                                <div className="blog-post-title" >{this.state.listData[this.state.teachingId].episodeTitle}</div>
                                <div className="blogdiv blogauthor" >by {this.state.listData[this.state.teachingId].seriesTitle} on {this.state.listData[this.state.teachingId].publishedDate}</div>
                                <div className="blogdiv blogdescription" > {this.state.listData[this.state.teachingId].description}</div>
                                <div className="blogdiv2" >
                                    <Button size="lg" className="blogButton" >Read More</Button>
                                </div>
                                <div><img alt="TBD" className="blog-image-desktop" src={(this.state.content.class === "teaching-sunday"||this.state.listData[this.state.teachingId].videoTypes === "ky-kids"||this.state.listData[this.state.teachingId].videoTypes === "ky-youth"||this.state.listData[this.state.teachingId].videoTypes === "ky-jrhigh"||this.state.listData[this.state.teachingId].videoTypes === "ky-srhigh")&&this.state.listData[this.state.teachingId].seriesTitle!=null?("/static/photos/series/baby-hero/"+this.state.listData[this.state.teachingId].videoTypes+"-"+this.state.listData[this.state.teachingId].seriesTitle.replace("?","")+".jpg"):this.state.listData[this.state.teachingId].Youtube.snippet.thumbnails.standard.url} /></div>
                            </div>
                            <div className="mobile-image-container"><img onClick={() => { this.handleClick(this.state.listData[this.state.teachingId]) }} alt="TBD" className="blog-image-mobile" src={(this.state.content.class === "teaching-sunday"||this.state.listData[this.state.teachingId].videoTypes === "ky-kids"||this.state.listData[this.state.teachingId].videoTypes === "ky-youth"||this.state.listData[this.state.teachingId].videoTypes === "ky-jrhigh"||this.state.listData[this.state.teachingId].videoTypes === "ky-srhigh")&&this.state.listData[this.state.teachingId].seriesTitle!=null?("/static/photos/series/baby-hero/"+this.state.listData[this.state.teachingId].videoTypes+"-"+this.state.listData[this.state.teachingId].seriesTitle.replace("?","")+".jpg"):this.state.listData[this.state.teachingId].Youtube.snippet.thumbnails.standard.url} /></div>
                        </div> : null
                    : null
            )
        }
        else return null
    }
}


export default withCookies(withRouter(BlogItem))
