import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import React, { useEffect, useState } from 'react';
import { Spinner, Tags, Trending, BlogSection, MostPopular } from '../components';
import { toast } from "react-toastify";

const Home = ({ setActive, user }) => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data() });
    });
    setTrendBlogs(trendBlogs);
  }

  useEffect(() => {
    getTrendingBlogs();
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlogs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
      getTrendingBlogs();
    };
  }, [setActive]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure wanted to delete that blog ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'blogs'),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() })
        });
        setBlogs(list);

      }, (error) => {
        console.log(error);
      }
    )

    // login for unmount
    return () => {
      unsub();
    };
  }, []);


  if (loading) {
    return <Spinner />
  }

  return (
    <div className='container-fluid pb-4 pt-4 padding'>
      <div className='container padding'>
        <div className='row mx-0'>
          <Trending blogs={trendBlogs} />

          <div className='col-md-8'>
            <BlogSection
              blogs={blogs}
              user={user}
              handleDelete={handleDelete}
            />
          </div>

          <div className='col-md-3'>
            <Tags tags={tags} />
            <MostPopular blogs={blogs} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home