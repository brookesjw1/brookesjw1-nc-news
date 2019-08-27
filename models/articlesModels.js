const connection = require('../db/connection')

exports.fetchArticleById = (id) => {
    return connection("articles")
            .select('*')
            .where("article_id", "=", id)
            .then(articleArray => {
                if (articleArray.length === 0) 
                return Promise.reject({ 
                    status: 404,
                    msg: 'article not found'})
                return connection('comments')
                .select('*')
                .where("article_id", "=", id)
                .then(commentArray => {
                    return {
                        ...articleArray[0],
                        comment_count: commentArray.length
                    }
                })
            })
          
            

}