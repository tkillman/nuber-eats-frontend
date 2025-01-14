const Login = () => {
  return (
    <div className="bg-slate-500 h-screen flex items-center justify-center">
      <div className="flex flex-col bg-white w-full max-w-screen-sm px-5 py-7 rounded-md shadow-md">
        <p>Login</p>
        <form>
          <div className="flex flex-col gap-3">
            <input
              placeholder="email"
              name="email"
              className="flex p-3 border-2 border-solid focus:bg-green-300"
            ></input>
            <input
              placeholder="password"
              name="password"
              className="flex p-3 border-2 border-solid focus:bg-green-300"
            ></input>
            <button className="p-3 w-full bg-blue-500">로그인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
