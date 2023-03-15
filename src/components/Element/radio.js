import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

const ChangeRadio = (props) => {
  const { options, onChange, name, selected } = props;

  return (
    <ButtonContainer
      id={props.labelId}
    >
      <AnimateSharedLayout>
        {options.map((option) => (
          <React.Fragment key={option.name}>
            <Input
              type="radio"
              id={option.value}
              value={option.value}
              name={name}
              defaultChecked={option.default}
            />
            <InputLabel
              htmlFor={option.value}
              key={option.value}
              initial={false}
              onClick={(e) => onChange(e)}
              animate={{
                visibility: "visible",
              }}
            >
              {selected === option.value && (
                <InputBackground
                  layoutId="radioBackground"
                  animate={{
                    backgroundColor: "#fff",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              {option.name}
            </InputLabel>
          </React.Fragment>
        ))}
      </AnimateSharedLayout>
    </ButtonContainer>
  );
};

const ButtonContainer = styled(motion.div)`
  position: relative;
  grid-column: span 4;
  display: flex;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  backdrop-filter: blur(30px);
  justify-content: space-around;
  align-items: center;

  input:checked + label {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    color: black;
  }
  input:disabled + label {
    text-decoration: line-through;
    text-decoration-thickness: 2px;
    transition: all 0.6s ease-in-out;
    border: 2px 1px solid white;
    cursor: not-allowed;
  }
`;
const Input = styled(motion.input)`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  width: 1px;
  border: 0;
  overflow: hidden;
`;
const InputLabel = styled(motion.label)`
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  text-align: center;
  color: #5d5d5b;
  font-weight: 600;
  border-radius: 6px;
  z-index: 2;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  user-select: none;
  padding: 9px;
  position: relative;
`;
const InputBackground = styled(motion.div)`
  background-color: #8cdd5b !important;
  position: absolute;
  top: 12px;
  left: 3px;
  right: 3px;
  bottom: 12px;
  border-radius: 7px;
  z-index: -1;
`;

export default ChangeRadio;
