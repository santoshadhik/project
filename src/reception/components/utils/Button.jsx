const Button = (props) => {
  return (
    <>
      <div>
        <button
          className={`border border-[#b52739] px-6 py-1 rounded-full hover:bg-[#b52739] hover:text-white duration-1000 flex gap-x-1 items-center ${props.btn}`}
          onClick={props.click}
        >
          {props.title}
        </button>
      </div>
    </>
  );
};

export default Button;
