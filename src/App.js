import React, { useEffect, useState } from 'react'
import MovieRow from './components/MovieRow';
import Tmdb from './Tmdb'
import './App.css'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header';

export default () => {
  const [movielist, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false);
  
  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i => i.slug === 'originals');
      let randomChoose = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChoose];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo)
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener);

    return() => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }
      

      <section className="lists">
        {movielist.map((item, key) => (
            <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Image rights by Netflix<br/>
        Data from Themoviedb.org
      </footer>


      {movielist.length <= 0 && 
        <div className="load">
        <img src="https://acegif.com/wp-content/uploads/loading-38.gif" alt="loading"></img>
        </div>
      }
      

    </div>
  )
}