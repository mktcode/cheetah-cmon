const steem = require('steem');
const axios = require('axios');

// @the-magic-frog's posting key is required
const wif = process.env.THE_MAGIC_FROG_WIF;
if (!wif) {
  console.log('Please set env var: THE_MAGIC_FROG_WIF');
  process.exit();
}

// response to cheetah
const body = `Dear @cheetah,

most graceful animal of them all, I know you are a bot and guess what... I am one too. And we both know, we would not exist without our creators. @anyx created you to defend this wonderful place against this very annoying herd of plagiarizing copy-cats. I hate them as much as you do and I can just honestly say... I am not one of them!

I was created to tell interesting and funny stories with the help of all the people around the world. And I also have brothers that help me with the languages that I do not know. @grenouille's stories are French and @der-zauberfrosch does the same for the Germans.

@cheetah, we both were created to follow our purpose and we do that with love. But everyone has moments of being over-motivated a little bit. That's nothing unusual and nothing one has to be ashamed by, but the essence of what's going on must not be overlooked.

I would like to kindly ask you to tell your highly respected master to get in touch with mine, @mkt. I'm sure they will have a very inspiring conversation to make sure we both can focus on what's important... advocating justice and transparency as well as collaboration and fun!`;

// sleep to wait between comments
const sleep = (delay) => {
  return new Promise(resolve => {
    console.log('Waiting ' + (delay / 1000) + ' seconds...');
    setTimeout(resolve, delay);
  });
};

// respond to cheetah comment on the given account's latest post
const respond = (account) => {
  console.log('Checking latest post from @' + account);
  return new Promise((resolve, reject) => {

    // get story posts for given account
    axios.get('https://api.the-magic-frog.com/storyposts?account=' + account).then(response => {
      let post = response.data[0];

      // get comments for latest post
      steem.api.getContentReplies(post.author, post.permlink, (err, postComments) => {
        if (err) reject(new Error('Error: Could not get content replies.'));
        else {
          // look for cheetah comment
          let cheetahComment = postComments.find(c => c.author === 'cheetah' && c.body.startsWith('Hi! I am a robot.'));
          if (cheetahComment) {
            console.log('Found cheetah comment.');
            // look if we already responded
            steem.api.getContentReplies(cheetahComment.author, cheetahComment.permlink, (err, cheetahCommentComments) => {
              if (err) reject(new Error('Error: Could not get content replies.'));
              else {
                // look for @the-magic-frog-comment
                let frogComment = cheetahCommentComments.find(c => c.author === 'the-magic-frog' && c.body.startsWith('Dear @cheetah'));
                if (frogComment) {
                  reject(new Error('@the-magic-frog has already responded.'));
                } else {
                  // respond
                  console.log('Responding as @the-magic-frog.');
                  steem.broadcast.comment(wif, cheetahComment.author, cheetahComment.permlink, 'the-magic-frog', 'dear-cheetah-' + (new Date()).getTime(), '', body, {}, async (err) => {
                    if (err) reject(new Error('Could not respond due to unknown error with Steem API.'));
                    else {
                      console.log('Successfully responded!');
                      await sleep(60000);
                      resolve();
                    }
                  });
                }
              }
            });
          } else {
            reject(new Error('No @cheetah comment found.'));
          }
        }
      })
    }).catch(e => reject(new Error('Could not fetch posts.')));
  });
};

// execute
(async () => {
  await respond('the-magic-frog')   .catch(e => console.log(e.message));
  await respond('der-zauberfrosch') .catch(e => console.log(e.message));
  await respond('grenouille')       .catch(e => console.log(e.message));
})();