import React from 'react';
import PostsDifference from "../components/PostsDifference";
import {useSelector} from "react-redux";


const SuggestedChangeScreen = () => {
  const currentPost = useSelector(state => state.post.post)
  const suggestedPost = useSelector(state => state.suggestedPost.post)

  return (
    <div>
      {(currentPost && suggestedPost) &&
        <PostsDifference newPostBlocks={currentPost.text.blocks}
                         previousPostBlocks={suggestedPost.text.blocks}/>}
    </div>
  );
};

export default SuggestedChangeScreen;