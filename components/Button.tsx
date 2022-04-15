import styled from "styled-components";

export const ButtonWrapper = styled.div`
  display: flex;
`

export const StyledButton = styled.button.attrs((props: { background: string }) => props)`
  margin: 15px;
  color: #ffffff;
  padding: 10px 40px;
  background-color: ${(props) => props.background};
  border-color: transparent;
  border-radius: .25rem;
  box-shadow: 8px 10px 20px 0 rgba(46,61,73,.30);
  cursor: pointer;
  transition: all .3s;
  
  &:focus, &:hover {
    outline: 0;
    background-color: ${(props) => props.background};
    box-shadow: 2px 4px 8px 0 rgba(46,61,73,.2);
  }
`