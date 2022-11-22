import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, Link, useParams } from "react-router-dom";

import SimpleMDE from "react-simplemde-editor";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import axios from "../../axios";
import { selectIsAuth } from "../../redux/slices/auth";

import styles from "./AddPost.module.scss";
import "easymde/dist/easymde.min.css";

export const AddPost = () => {
  const { id } = useParams();

  const isAuth = useSelector(selectIsAuth);

  const navigate = useNavigate();

  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const inputFileRef = React.useRef();

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];

      formData.append("image", file);

      const { data } = await axios.post("/upload", formData);

      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = () => {
    const fields = {
      title,
      imageUrl,
      tags: tags.split(" "),
      text,
    };
    if (id) {
      axios.patch(`/posts/${id}`, fields).then(() => {
        navigate(`/post/${id}`);
      });
      return;
    }
    axios.post("/posts", fields).then(({ data: { _id } }) => {
      navigate(`/post/${_id}`);
    });
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(" "));
      });
    }
  }, []);

  const options = React.useMemo(
    () =>
      ({
        spellChecker: false,
        maxHeight: "400px",
        autofocus: true,
        placeholder: "Введите текст...",
        status: false,
        autosave: {
          enabled: true,
          delay: 1000,
        },
      } as EasyMDE.Options),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current && inputFileRef.current?.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:5000${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <Link to="/">
          <Button size="large">Отмена</Button>
        </Link>
      </div>
    </Paper>
  );
};
