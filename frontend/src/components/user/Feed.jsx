import React, { useEffect, useState } from 'react'
import Article from './Article'
import axios from 'axios'
import { GatewayUrl } from '../const/urls'

const Feed = () => {

  const [articles, setArticles] = useState([])

  useEffect(() => {
    const fetchArticleDetails = async () => {
      console.log("fetching article details")
      try {
        const response = await axios.get(`${GatewayUrl}api/articles/`)
        console.log("response", response.data)
        setArticles(response.data)
      } catch (error) {
        console.error("Error fetching article details", error)
      }
    };

    fetchArticleDetails();
  }, [])

  return (
    <main className="flex-1 px-4">
      {articles.map((article) => (
        article.user_data ? (
          <Article key={article.id} article={article} />
        ) : null
      ))}
    </main>
  )
}

export default Feed
