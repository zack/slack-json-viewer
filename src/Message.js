import React from 'react';
import PropTypes from 'prop-types';

class Message extends React.Component {
  replaceUserStringWithUser(text) {
    const user_index = this.props.user_index;
    let new_text = text;

    const matches = text.match(RegExp('<@U[A-Z0-9]{8}>','g')) ?? [];
    matches.forEach((match) => {
      let str = match.slice(2,-1);
      new_text = text.replaceAll(str, user_index[str].display_name);
    });

    return new_text;
  }

  render() {
    const user_index = this.props.user_index;
    const thread_index = this.props.thread_index;
    const m = this.props.m;
    const t = new Date(m.ts * 1000).toString().slice(4,24);

    let user_string;

    if (m.user_profile !== undefined) {
      user_string = `${m.user_profile.display_name} (${m.user_profile.real_name})`
    } else if (user_index[m.user]) {
      console.log(user_index[m.user])
      user_string = `${user_index[m.user].display_name} (${user_index[m.user].real_name})`
    } else {
      user_string = `((${m.user}))`
    }

    return (
      <div className={`message ${m.replies && "has-replies"}`}>
        {m.user_profile &&
          <div className="text">
            <div className="username">{user_string} <span className="timestamp">{t}</span></div>
            <div>{this.replaceUserStringWithUser(m.text)}</div>
            {m.reactions &&
              <div className="reactions">
                {m.reactions.map((reaction) => {
                  return(<span className="react">:{reaction.name}: ({reaction.count})</span>);
                })}
              </div>
            }
          </div>
        }

        {m.files &&
          <div className="fileUpload">
            File uploaded by user {user_string}
          </div>
        }

        {m.subtype && m.subtype === "thread_broadcast" &&
          <div className="threadBroadcast">
              <div className="username">{user_string} ((thread broadcast)) <span className="timestamp">{t}</span></div>
              <div>{this.replaceUserStringWithUser(m.text)}</div>
          </div>
        }

        {m.subtype && m.subtype === "channel_leave" &&
            <div className="channelLeave">
              {this.replaceUserStringWithUser(m.text)}
            </div>
        }

        {m.replies &&
          m.replies.map((reply) => {
            let reply_message;

            if (thread_index[m.thread_ts] !== undefined) {
              reply_message = thread_index[m.thread_ts][reply.ts];
            } else {
              reply_message = {text: "((Message Not Found))"};
            }

          const rt = new Date(reply.ts * 1000).toString().slice(4,24);

            return(
              <div className="reply">
                <div className="text">
                  <div className="username">{user_index[reply.user].display_name} ({user_index[reply.user].real_name}) <span className="timestamp">{rt}</span></div>
                  <div>{this.replaceUserStringWithUser(reply_message.text)}</div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

Message.propTypes = {
  user_index: PropTypes.objectOf(
    PropTypes.shape({
      display_name: PropTypes.string,
      real_name: PropTypes.string,
    }),
  ),
  thread_index: PropTypes.objectOf(
    PropTypes.shape({
      files: PropTypes.array,
      text: PropTypes.string,
      ts: PropTypes.string,
      type: PropTypes.string,
      user: PropTypes.string,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          user: PropTypes.string,
          ts: PropTypes.string,
        })
      ),
      user_profile: PropTypes.shape({
        first_name: PropTypes.string,
        real_name: PropTypes.string,
        display_name: PropTypes.string,
        name: PropTypes.string,
      })
    }),
  ),
  m: PropTypes.shape({
    files: PropTypes.array,
    text: PropTypes.string,
    ts: PropTypes.string,
    type: PropTypes.string,
    user: PropTypes.string,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string,
        ts: PropTypes.string,
      })
    ),
    user_profile: PropTypes.shape({
      first_name: PropTypes.string,
      real_name: PropTypes.string,
      display_name: PropTypes.string,
      name: PropTypes.string,
    }),
    reaction: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.string,
      }),
    )
  })
};

export default Message;
