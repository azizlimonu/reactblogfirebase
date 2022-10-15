import React, { useEffect, useRef, useState } from "react";
import '@pathofdev/react-tag-input/build/index.css';
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from '../firebase';
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { WithContext as ReactTags } from 'react-tag-input';

// tag 
const KeyCodes = {
  comma: 188,
  enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];
// ====>
const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
};

const categoryOption = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

const AddEditBlog = ({ user, setActive }) => {

  const [form, setForm] = useState(initialState);


  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { title, tags, category, trending, description } = form;

  // useEffect run for the file change
  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress =
            // progress uploading image
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is' + progress + '% done');
          setProgress(progress);
          switch (snapshot.state) {
            case 'pause':
              console.log('upload is paused');
              break;

            case 'running':
              console.log('upload is running');
              break;

            default:
              break;
          }
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((download) => {
            toast.info('image upload to firebase successfully');
            setForm((prev) => ({ ...prev, imgUrl: download }));
          })
        }
      );
    }
    // run the function if we have the file and upload the file
    file && uploadFile();
  }, [file])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  // ==================================// second way to do the tag
  const tagRef = useRef();
  const handleAddition = (tags) => {
    // press enter and the tag will push to the array tag and display it
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tags] }))
  };

  const handleDelete = (i) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag, index) => index !== i)
    }));
  }
  // ==================================// second way to do the tag

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    if (category && tags && title && description && trending) {
      try {
        // make collection in firestore db as 'blogs'
        await addDoc(collection(db, "blogs"), {
          ...form,
          timestamp: serverTimestamp(),
          author: user.displayName,
          userId: user.uid,
        });
        toast.success("Blog created successfully");
      } catch (err) {
        console.log(err);
      }
    }
    navigate('/');
    setActive("home");
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12">
          <div className="text-center heading py-2">
            Update Blog
          </div>
        </div>

        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row blog-form" onSubmit={handleSubmit}>
              {/* Title */}
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box w-full"
                  placeholder="Title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>

              {/* Tags */}
              <div className="col-12 py-3 container">
                <div className="tag-container">
                  <ReactTags
                    tags={tags}
                    delimiters={delimiters}
                    inline
                    handleAddition={handleAddition}
                    handleDelete={handleDelete}
                    inputFieldPosition='inline'
                    autocomplete
                  />
                </div>
              </div>

              {/* trending */}
              <div className="col-12 py-3">
                <p className="trending">
                  Trending blog?
                </p>

                {/* checked for the trending */}
                <div className="form-check-inline mx-2">
                  <input
                    type='radio'
                    className="form-check-input"
                    value='yes'
                    name="radioOption"
                    checked={trending === 'yes'}
                    onChange={handleTrending}
                  />

                  <label
                    htmlFor="radioOption"
                    className="form-check-label"
                  >
                    Yes &nbsp;&nbsp;
                  </label>

                  <input
                    type="radio"
                    className="form-check-input"
                    value="no"
                    name="radioOption"
                    checked={trending === "no"}
                    onChange={handleTrending}
                  />

                  <label
                    htmlFor="radioOption"
                    className="form-check-label"
                  >
                    No
                  </label>
                </div>
              </div>

              {/* category dropdown */}
              <div className="col-12 py-3">
                <select
                  value={category}
                  onChange={onCategoryChange}
                  className="catg-dropdown"
                >
                  <option>Please select category</option>
                  {categoryOption.map((option, index) => (
                    <option value={option || ""} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* description */}
              <div className="col-12 py-3">
                <textarea
                  className="form-control description-box"
                  placeholder="Description"
                  value={description}
                  name="description"
                  onChange={handleChange}
                />
              </div>

              {/* uplooad field */}
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {/* submit  */}
              <div className="col-12 py-3 text-center">
                <button
                  className="btn btn-add"
                  type="submit"
                  disabled={progress !== null && progress < 100}
                >
                  {/* {id ? "Update" : "Submit"} */}
                  Update
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditBlog;