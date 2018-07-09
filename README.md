# Cheetah! C'mon!

This bot is for anyone who constantly receives comments from @cheetah on content that has nothing to do with plagiarism but is simply not only available Steem but also on other websites.
Let's say you have a blog and you plublish your posts there and on Steemit.com. @cheetah accuses you for plagiarism which is obviously not the case.

For @the-magic-frog the situation is the following. Everyday a post is published containing the current story and this story can also be read on the-magic-frog.com. For weeks now the first comment on the story posts is from @cheetah because it finds the same content on the website or in another post from the same account. This is simply the mechanic of the project.

I got bored to respond to @cheetah all the time, asking to stop it, so I wrote a bot for that. Maybe that's also helpful for others.

The bot is very simple. It looks for a comment from @cheetah on the latest post from a given account. If there's no response from that account, it takes care of that, based on a comment template you must provide.

# How to use

```
git clone https://github.com/mktcode/cheetah-cmon.git
cd cheetah-cmon
npm i
export POSTING_KEY=...
export ACCOUNT=...
```

`ACCOUNT` is of course the account that the bot should watch and look for a @cheetah comment to reply to.

`POSTING_KEY` is the posting key of that account, so the bot can post the reply. 

Now create a `comment.md` in the root directory of the project. In this file you put your comment, that you want to be automatically published whenever @cheetah comments on your latest post.

`comment.md`:

```
Dear @cheetah,

please consider whitelisting my account...
```

### Cronjob

The cronjob could look like this:

`0 12 * * * . /home/<user>/cheetah-cmon.conf; /usr/local/bin/node /home/<user>/cheetah-cmon/index.js >> /home/<user>/cheetah-cmon/cheetah-cmon.log`
(everyday at 12.00)

`/home/username/cheetah-cmon.conf`:

```
export POSTING_KEY=...
export ACCOUNT=...
```