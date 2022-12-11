const layout= require('../layout'); 



module.exports = () => {
  const content = `
    <div>
      <form method="POST">
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
   `;
  return layout({ content });  
    

};
