const layout = require('../layout');

module.exports = ({ req }) => {
  content = `
    <div>
      ${ req.session.userId }
      <form method="POST">
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <input type="password" name="confirmPassword" palceholder="confirm password" />
        <button>Sign Up</button>
      </form>
    </div>
   `;
  return layout({ content });
  };
