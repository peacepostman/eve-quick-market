export default {
  menuPortal: (provided: any) => ({ ...provided, zIndex: 5 }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    color: state.isSelected || state.isFocused ? "#fff" : "#ddd",
    backgroundColor:
      state.isSelected || state.isFocused
        ? "rgba(255, 255, 255, .2)"
        : "transparent",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "rgb(19, 36, 44)",
    borderRadius: 0,
    borderColor: state.isFocused ? "#fff" : "rgba(255, 255, 255, .6)",
    boxShadow: state.isFocused ? "none" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#fff" : "rgba(255, 255, 255, .8)",
    },
  }),
  input: (provided: any) => ({ ...provided, color: "#fff" }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "rgba(19, 36, 44, .4)",
    border: "1px solid rgba(255, 255, 255, .6)",
    borderRadius: 0,
    backdropFilter: "blur(6px)",
  }),
};
