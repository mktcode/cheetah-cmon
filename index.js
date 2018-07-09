const fs = require('fs');
const steem = require('steem');

// get posting key and account name from env
const postingKey = process.env.POSTING_KEY;
const account = process.env.ACCOUNT;
if (!postingKey || !account) {
  console.log('Please set required env vars:');
  console.log('export POSTING_KEY=...');
  console.log('export ACCOUNT=...');
  process.exit();
}

// comment template for response to cheetah
const body = fs.readFileSync('./comment.md', 'utf-8');

// respond to cheetah comment on the given account's latest post
const respond = () => {
  console.log('Checking latest post from @' + account);
  // get story posts for given account
  steem.api.getDiscussionsByBlog({tag: account, limit: 1}, (err, posts) => {
    if (err) console.log(err);
    else {
      let post = posts[0];

      // get comments for latest post
      steem.api.getContentReplies(post.author, post.permlink, (err, postComments) => {
        if (err) console.log('Error: Could not get replies for @' + account + '\'s latest post.');
        else {
          // look for cheetah comment
          let cheetahComment = postComments.find(c => c.author === 'cheetah' && c.body.startsWith('Hi! I am a robot.'));
          if (cheetahComment) {
            console.log('Found cheetah comment.');
            // look if we already responded
            steem.api.getContentReplies(cheetahComment.author, cheetahComment.permlink, (err, cheetahCommentComments) => {
              if (err) console.log('Error: Could not get replies for @cheetah\'s comment.');
              else {
                // look for existing reply
                let reply = cheetahCommentComments.find(c => c.author === account);
                if (reply) {
                  console.log('@' + account + ' has already replied.');
                } else {
                  // post reply
                  console.log('Responding as @' + account + '.');
                  steem.broadcast.comment(postingKey, cheetahComment.author, cheetahComment.permlink, account, 'reply-to-cheetah-' + (new Date()).getTime(), '', body, {}, (err) => {
                    if (err) console.log('Could not respond due to unknown error with the Steem API.');
                    else {
                      console.log('Successfully responded!');
                    }
                  });
                }
              }
            });
          } else {
            console.log('No @cheetah comment found.');
          }
        }
      })
    }
  });
};

// execute
respond();