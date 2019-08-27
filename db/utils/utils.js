exports.formatDates = list => {
    return list.map(article => {return { ...article, created_at: new Date(article.created_at) } })
};

exports.makeRefObj = list => {
    if (!list.length) return {};
    const refObj = {};
    for (let i = 0; i < list.length; i++) {
        refObj[list[i].title] = list[i].article_id;
    }
    return refObj;
};

exports.formatComments = (comments, articleRef) => {
    return comments.map(comment => {
        return {
            author: comment.created_by,
            article_id: articleRef[comment.belongs_to],
            votes: comment.votes,
            created_at: new Date(comment.created_at),
            body: comment.body
        }
    })
};
