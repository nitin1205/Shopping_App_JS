const express = require('express');
const parseBody = require('body-parser');

const app = express();

app.use(parseBody.urlencoded({ extended:true }));

app.get('/', (req, res) => {
    res.send(`
	    <div>
	      <form method="POST">
	        <input type="email" name="email" placeholder="email" />
		<input type="password" name="password" placeholder="password" />
		<input type="password" name="confirmPassword" palceholder="confirm password" />
		<button>Sign Up</button>
	      </form>
	    </div>`);
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('user added');
});

app.listen(3000, () => {
    console.log('listening');
});
