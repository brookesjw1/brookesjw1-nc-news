process.env.NODE_ENV = "test";

const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('returns a new array with correctly formatted dates for a single article', () => {
    const input =   [{
      title: 'Who Will Manage Your Club in 2021?',
      topic: 'football',
      author: 'happyamy2016',
      body: 'Managerial changes are too common in the modern day game. Already in ' +
        'the 16/17 season, we have seen 14 managers lose their job from the ' +
        'Premier League to League Two. Swansea’s Francesco Guidolin became the ' +
        'first top division manager to lose his job but already question marks ' +
        'are raised regarding the future of the likes of David Moyes and Mike ' +
        'Phelan.',
      created_at: 1472144905177
    }]
    const actualResult = formatDates(input);
    const expectedResult = [{
      title: 'Who Will Manage Your Club in 2021?',
      topic: 'football',
      author: 'happyamy2016',
      body: 'Managerial changes are too common in the modern day game. Already in ' +
        'the 16/17 season, we have seen 14 managers lose their job from the ' +
        'Premier League to League Two. Swansea’s Francesco Guidolin became the ' +
        'first top division manager to lose his job but already question marks ' +
        'are raised regarding the future of the likes of David Moyes and Mike ' +
        'Phelan.',
      created_at: new Date(1472144905177)
    }]
    expect(actualResult).to.eql(expectedResult)
  });
  it('returns a new array with correctly formatted dates for a multi article array', () => {
    const input =   [{
      title: '1',
      topic: 'football',
      author: 'happyamy2016',
      body: '-----',
      created_at: 1472144905177
    },
    {
      title: '2',
      topic: 'football',
      author: 'happyamy2016',
      body: '-----',
      created_at: 1472144905178
    },
    {
      title: '3',
      topic: 'football',
      author: 'happyamy2016',
      body: '-----',
      created_at: 1472144905179
    }
  ];
  const actualResult = formatDates(input);
  const expectedResult = [{
    title: '1',
    topic: 'football',
    author: 'happyamy2016',
    body: '-----',
    created_at: new Date(1472144905177)
  },
  {
    title: '2',
    topic: 'football',
    author: 'happyamy2016',
    body: '-----',
    created_at: new Date(1472144905178)
  },
  {
    title: '3',
    topic: 'football',
    author: 'happyamy2016',
    body: '-----',
    created_at: new Date(1472144905179)
  }];
  expect(actualResult).to.eql(expectedResult)
  });
  it('does not mutate the original array', () => {
    const input =   [{
      title: '1',
      topic: 'football',
      author: 'happyamy2016',
      body: '-----',
      created_at: 1472144905177
    },
    {
      title: '2',
      topic: 'football',
      author: 'happyamy2016',
      body: '-----',
      created_at: 1472144905178
    },
    {
      title: '3',
      topic: 'football',
      author: 'happyamy2016',
      body: '-----',
      created_at: 1472144905179
    }
  ];
  formatDates(input);
  const control =   [{
    title: '1',
    topic: 'football',
    author: 'happyamy2016',
    body: '-----',
    created_at: 1472144905177
  },
  {
    title: '2',
    topic: 'football',
    author: 'happyamy2016',
    body: '-----',
    created_at: 1472144905178
  },
  {
    title: '3',
    topic: 'football',
    author: 'happyamy2016',
    body: '-----',
    created_at: 1472144905179
  }
];
expect(input).to.eql(control);
  });
});

describe('makeRefObj', () => {
  it('returns an empty object when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({})
  });
  it('returns a lookup object when passed an array with a single article', () => {
    const input = [{
      article_id: 34,
      title: 'The Notorious MSG’s Unlikely Formula For Success',
      body: "The 'umami' craze has turned a much-maligned and misunderstood " +
        'food additive into an object of obsession for the world’s most ' +
        'innovative chefs. But secret ingredient monosodium glutamate’s ' +
        'biggest secret may be that there was never anything wrong with it ' +
        'at all.',
      votes: 0,
      topic: 'cooking',
      author: 'grumpy19',
      created_at: "2017-08-16T22:08:30.430Z"
    }];
    const actualResult = makeRefObj(input);
    const expectedResult = {'The Notorious MSG’s Unlikely Formula For Success': 34}
    expect(actualResult).to.eql(expectedResult);
  });
  it('returns a lookup object when passed an array with multiple owners', () => {
    const input = [{
      article_id: 25,
      title: 'Sweet potato & butternut squash soup with lemon & garlic toast',
      body: 'Roast your vegetables in honey before blitzing into this velvety ' +
        'smooth, spiced soup - served with garlicky, zesty ciabatta slices for ' +
        'dipping',
      votes: 0,
      topic: 'cooking',
      author: 'weegembump',
      created_at: "2017-08-18T09:25:14.275Z"
    },
    {
      article_id: 26,
      title: 'HOW COOKING HAS CHANGED US',
      body: 'In a cave in South Africa, archaeologists have unearthed the remains of ' +
        'a million-year-old campfire, and discovered tiny bits of animal bones ' +
        'and ash from plants. It’s the oldest evidence of our ancient human ' +
        'ancestors—probably Homo erectus, a species that preceded ours—cooking a ' +
        'meal.',
      votes: 0,
      topic: 'cooking',
      author: 'weegembump',
      created_at: "2017-04-21T12:34:54.761Z"
    },
    {
      article_id: 27,
      title: 'Thanksgiving Drinks for Everyone',
      body: 'Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, ' +
        'cranberry sauce, stuffing, and last but not least, a juicy ' +
        'turkey. Don’t let your meticulous menu fall short of ' +
        'perfection; flavorful cocktails are just as important as the ' +
        'meal. Here are a few ideas that will fit right into your ' +
        'festivities.',
      votes: 0,
      topic: 'cooking',
      author: 'grumpy19',
      created_at: "2017-04-23T18:00:55.514Z"
    },
    {
      article_id: 28,
      title: 'High Altitude Cooking',
      body: 'Most backpacking trails vary only a few thousand feet ' +
        'elevation. However, many trails can be found above 10,000 ' +
        'feet. But what many people don’t take into consideration at ' +
        'these high altitudes is how these elevations affect their ' +
        'cooking.',
      votes: 0,
      topic: 'cooking',
      author: 'happyamy2016',
      created_at: "2018-05-27T03:32:28.514Z"
    },
    {
      article_id: 29,
      title: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      body: "n 1686, the croissant was invented in Austria. That's a fun fact I'd " +
        "probably never had known or maybe don't even really need to know, but " +
        "now I do, thanks to Julia Rothman's Food Anatomy: The Curious Parts & " +
        'Pieces of Our Edible World. Rothman has an entire series of ' +
        'illustrated Anatomy books, including Nature and Farm, packed with ' +
        'infographics, quirky facts, and maps that you can get lost in for ' +
        'hours—in a fun way, not in a boring textbook way. It makes you wonder ' +
        "why textbooks aren't this fun to read. Can someone look into this? " +
        'Thanks.',
      votes: 0,
      topic: 'cooking',
      author: 'tickle122',
      created_at: "2017-03-11T13:20:18.573Z"
    }]
    const actualResult = makeRefObj(input);
    const expectedResult = {'Sweet potato & butternut squash soup with lemon & garlic toast': 25, 'HOW COOKING HAS CHANGED US': 26, 'Thanksgiving Drinks for Everyone': 27, 'High Altitude Cooking': 28, 'A BRIEF HISTORY OF FOOD—NO BIG DEAL': 29}
    expect(actualResult).to.eql(expectedResult);
  });
  it('does not mutate the original array', () => {
    const input = [{
      article_id: 25,
      title: 'Sweet potato & butternut squash soup with lemon & garlic toast',
      body: 'Roast your vegetables in honey before blitzing into this velvety ' +
        'smooth, spiced soup - served with garlicky, zesty ciabatta slices for ' +
        'dipping',
      votes: 0,
      topic: 'cooking',
      author: 'weegembump',
      created_at: "2017-08-18T09:25:14.275Z"
    },
    {
      article_id: 26,
      title: 'HOW COOKING HAS CHANGED US',
      body: 'In a cave in South Africa, archaeologists have unearthed the remains of ' +
        'a million-year-old campfire, and discovered tiny bits of animal bones ' +
        'and ash from plants. It’s the oldest evidence of our ancient human ' +
        'ancestors—probably Homo erectus, a species that preceded ours—cooking a ' +
        'meal.',
      votes: 0,
      topic: 'cooking',
      author: 'weegembump',
      created_at: "2017-04-21T12:34:54.761Z"
    },
    {
      article_id: 27,
      title: 'Thanksgiving Drinks for Everyone',
      body: 'Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, ' +
        'cranberry sauce, stuffing, and last but not least, a juicy ' +
        'turkey. Don’t let your meticulous menu fall short of ' +
        'perfection; flavorful cocktails are just as important as the ' +
        'meal. Here are a few ideas that will fit right into your ' +
        'festivities.',
      votes: 0,
      topic: 'cooking',
      author: 'grumpy19',
      created_at: "2017-04-23T18:00:55.514Z"
    },
    {
      article_id: 28,
      title: 'High Altitude Cooking',
      body: 'Most backpacking trails vary only a few thousand feet ' +
        'elevation. However, many trails can be found above 10,000 ' +
        'feet. But what many people don’t take into consideration at ' +
        'these high altitudes is how these elevations affect their ' +
        'cooking.',
      votes: 0,
      topic: 'cooking',
      author: 'happyamy2016',
      created_at: "2018-05-27T03:32:28.514Z"
    },
    {
      article_id: 29,
      title: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      body: "n 1686, the croissant was invented in Austria. That's a fun fact I'd " +
        "probably never had known or maybe don't even really need to know, but " +
        "now I do, thanks to Julia Rothman's Food Anatomy: The Curious Parts & " +
        'Pieces of Our Edible World. Rothman has an entire series of ' +
        'illustrated Anatomy books, including Nature and Farm, packed with ' +
        'infographics, quirky facts, and maps that you can get lost in for ' +
        'hours—in a fun way, not in a boring textbook way. It makes you wonder ' +
        "why textbooks aren't this fun to read. Can someone look into this? " +
        'Thanks.',
      votes: 0,
      topic: 'cooking',
      author: 'tickle122',
      created_at: "2017-03-11T13:20:18.573Z"
    }];
    makeRefObj(input);
    const control = [{
      article_id: 25,
      title: 'Sweet potato & butternut squash soup with lemon & garlic toast',
      body: 'Roast your vegetables in honey before blitzing into this velvety ' +
        'smooth, spiced soup - served with garlicky, zesty ciabatta slices for ' +
        'dipping',
      votes: 0,
      topic: 'cooking',
      author: 'weegembump',
      created_at: "2017-08-18T09:25:14.275Z"
    },
    {
      article_id: 26,
      title: 'HOW COOKING HAS CHANGED US',
      body: 'In a cave in South Africa, archaeologists have unearthed the remains of ' +
        'a million-year-old campfire, and discovered tiny bits of animal bones ' +
        'and ash from plants. It’s the oldest evidence of our ancient human ' +
        'ancestors—probably Homo erectus, a species that preceded ours—cooking a ' +
        'meal.',
      votes: 0,
      topic: 'cooking',
      author: 'weegembump',
      created_at: "2017-04-21T12:34:54.761Z"
    },
    {
      article_id: 27,
      title: 'Thanksgiving Drinks for Everyone',
      body: 'Thanksgiving is a foodie’s favorite holiday. Mashed potatoes, ' +
        'cranberry sauce, stuffing, and last but not least, a juicy ' +
        'turkey. Don’t let your meticulous menu fall short of ' +
        'perfection; flavorful cocktails are just as important as the ' +
        'meal. Here are a few ideas that will fit right into your ' +
        'festivities.',
      votes: 0,
      topic: 'cooking',
      author: 'grumpy19',
      created_at: "2017-04-23T18:00:55.514Z"
    },
    {
      article_id: 28,
      title: 'High Altitude Cooking',
      body: 'Most backpacking trails vary only a few thousand feet ' +
        'elevation. However, many trails can be found above 10,000 ' +
        'feet. But what many people don’t take into consideration at ' +
        'these high altitudes is how these elevations affect their ' +
        'cooking.',
      votes: 0,
      topic: 'cooking',
      author: 'happyamy2016',
      created_at: "2018-05-27T03:32:28.514Z"
    },
    {
      article_id: 29,
      title: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
      body: "n 1686, the croissant was invented in Austria. That's a fun fact I'd " +
        "probably never had known or maybe don't even really need to know, but " +
        "now I do, thanks to Julia Rothman's Food Anatomy: The Curious Parts & " +
        'Pieces of Our Edible World. Rothman has an entire series of ' +
        'illustrated Anatomy books, including Nature and Farm, packed with ' +
        'infographics, quirky facts, and maps that you can get lost in for ' +
        'hours—in a fun way, not in a boring textbook way. It makes you wonder ' +
        "why textbooks aren't this fun to read. Can someone look into this? " +
        'Thanks.',
      votes: 0,
      topic: 'cooking',
      author: 'tickle122',
      created_at: "2017-03-11T13:20:18.573Z"
    }];
    expect(input).to.eql(control);
  });
});

describe('formatComments', () => {
  const articleRef = {
    'Living in the shadow of a great man': 1,
    'Sony Vaio; or, The Laptop': 2,
    'Eight pug gifs that remind me of mitch': 3,
    'Student SUES Mitch!': 4,
    'UNCOVERED: catspiracy to bring down democracy': 5,
    A: 6,
    Z: 7,
    'Does Mitch predate civilisation?': 8,
    "They're not exactly dogs, are they?": 9,
    'Seven inspirational thought leaders from Manchester UK': 10,
    'Am I a cat?': 11,
    Moustache: 12
  }  
  it('returns an empty array when passed an empty array', () => {
    expect(formatComments([])).to.eql([])
  });
  it('returns a correctly formatted array of objects when passed an array containing one comment', () => {
    const input = [ {
      body: 'This morning, I showered for nine minutes.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389
    }
  ];
  const actualResult = formatComments(input, articleRef);
  const expectedResult = [{
    author: 'butter_bridge',
    article_id: 1,
    votes: 16,
    created_at: new Date(975242163389),
    body: 'This morning, I showered for nine minutes.'
  }];
  expect(actualResult).to.eql(expectedResult)
  });
  it('returns a correctly formatted array of objects when passed an array containing multiple comments', () => {
    const input = [ {
      body: '1',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389
    },
    {
      body: '2',
      belongs_to: 'Sony Vaio; or, The Laptop',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163388
    },
    {
      body: '3',
      belongs_to: 'Moustache',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163387
    }
  ];
  const actualResult = formatComments(input, articleRef);
  const expectedResult = [{
    author: 'butter_bridge',
    article_id: 1,
    votes: 16,
    created_at: new Date(975242163389),
    body: '1'
  },
  {
    author: 'butter_bridge',
    article_id: 2,
    votes: 16,
    created_at: new Date(975242163388),
    body: '2'
  },
  {
    author: 'butter_bridge',
    article_id: 12,
    votes: 16,
    created_at: new Date(975242163387),
    body: '3'
  }
];
expect(actualResult).to.eql(expectedResult);
  });
  it('does not mutate the original array', () => {
    const input = [ {
      body: '1',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389
    },
    {
      body: '2',
      belongs_to: 'Sony Vaio; or, The Laptop',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163388
    },
    {
      body: '3',
      belongs_to: 'Moustache',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163387
    }
  ];
  formatComments(input, articleRef);
  const control = [ {
    body: '1',
    belongs_to: 'Living in the shadow of a great man',
    created_by: 'butter_bridge',
    votes: 16,
    created_at: 975242163389
  },
  {
    body: '2',
    belongs_to: 'Sony Vaio; or, The Laptop',
    created_by: 'butter_bridge',
    votes: 16,
    created_at: 975242163388
  },
  {
    body: '3',
    belongs_to: 'Moustache',
    created_by: 'butter_bridge',
    votes: 16,
    created_at: 975242163387
  }
];
expect(input).to.eql(control);
  });
});
