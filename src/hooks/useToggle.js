
import  { useState } from 'react';

export const useToggle = (initial) => {
    const [isToggled, setToggle] = useState(initial);
    const toggle = () => setToggle(prevstate => !prevstate);
    return { isToggled, setToggle, toggle }
};