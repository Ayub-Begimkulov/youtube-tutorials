import { useInsertionEffect, useRef } from "react";

export const UseInsertionEffect = () => {
  const ref = useRef(null);

  useInsertionEffect(() => {
    const element = document.getElementById("my-div");
    console.log(ref.current, element);
  }, []);

  return (
    <div ref={ref} id="my-div">
      some text here
    </div>
  );
};

// layoutEffect add styles
// layoutEffect measure dom // style recalculation
// layoutEffect add style
// layoutEffect measure dom // style recalculation
