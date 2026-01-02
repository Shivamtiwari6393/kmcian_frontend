function ErrorComponent() {
  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        margin: "20px",
        fontWeight : "bold"
      }}
    >
      Sorry! There is a Problem. please move to{" "}
      <a
      
      style={
        {
            color:"red"
        }
      }
      
      href="/">Home</a>
    </div>
  );
}

export default ErrorComponent;
