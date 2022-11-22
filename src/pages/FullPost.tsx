import React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import axios from "../axios";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const { id } = useParams();

  React.useEffect(() => {
    setIsLoading(true);
    axios.get(`/posts/${id}`).then(({ data }) => {
      setData(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading && data) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        {...data}
        imageUrl={data?.imageUrl ? `http://localhost:5000${data.imageUrl}` : ""}
        commentsCount={3}
        isFullPost
      >
        <ReactMarkdown children={data?.text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
