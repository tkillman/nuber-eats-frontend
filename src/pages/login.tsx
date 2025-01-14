import { useForm } from "react-hook-form";

interface IForm {
  email?: string;
  password?: string;
}

const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>();

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="bg-slate-500 h-screen flex items-center justify-center">
      <div className="flex flex-col bg-white w-full max-w-screen-sm px-5 py-7 rounded-md shadow-md">
        <p>Login</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="email"
              className="input"
              {...register("email", {
                required: "Email is required",
              })}
            ></input>
            {errors.email?.message && (
              <span className="text-red-600">{errors.email?.message}</span>
            )}
            <input
              type="password"
              placeholder="password"
              className="input"
              {...register("password", {
                required: "Email is required",
              })}
            ></input>
            {errors.password?.message && (
              <span className="text-red-600">{errors.password?.message}</span>
            )}
            <button className="button">로그인</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
