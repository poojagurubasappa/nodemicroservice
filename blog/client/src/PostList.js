import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Comment from "./Comment";
import CommentList from "./CommentList";

export default () => {
    const [ posts, setPosts ] = useState({});
    const getPosts = async () => {
        const res = await axios.get('http://localhost:4002/posts');
        console.log(res.data, 'RESSS')
        setPosts(res.data);
    }

    useEffect(() => {
        getPosts();
    }, []);

    const postsArr = Object.values(posts).map(post => {
        return (
            <div className='card' style={{width:'30%', marginBottom: '20px'}} key={post.id}>
                <div className='card-body'>
                    <h3>{post.title}</h3>
                    <CommentList comments={post.comments} />
                    <Comment postId={post.id} />
                </div>

            </div>
        )
    });


    return <div className='d-flex flex-row flex-wrap justify-content-between'>
        {postsArr}
    </div>
}