const layout = require('../layout');

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return '';
  }
};

module.exports = ({ req, errors }) => {
  content = `
    <div>
      ${ req.session.userId }
      <form method="POST">
        <input type="email" name="email" placeholder="email"/>
	${getError(errors, 'email')}
        <input type="password" name="password" placeholder="password"/>
	${getError(errors, 'password')}
        <input type="password" name="confirmPassword" palceholder="confirm password"/>
	${getError(errors, 'confirmPassword')}
        <button>Sign Up</button>
      </form>
    </div>
   `;
  return layout({ content });
  };
