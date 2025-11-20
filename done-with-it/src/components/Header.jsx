import React from "react";
import Colors from "../resources/colors";


export default function Header({ setCurrentPage }) {
  return (
      <header style={styles.header}>
	  	
	      <img src={"/icon.png"} style={styles.logoIcon} />
		 <h1 style={styles.logo}> DoneWithIt</h1>
	  
      <nav style={styles.nav}>
          <button style={styles.link}  onClick={() => setCurrentPage("marketplace")}>
          Marketplace
        </button>
        <button style={styles.link} onClick={() => setCurrentPage("sell")}>
          Sell
        </button>
        <button style={styles.link} onClick={() => setCurrentPage("about")}>
          About
        </button>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: Colors.primary,
    color: Colors.textLight,
      flexWrap: "wrap",
  },
  logo: {
    fontSize: "1.6rem",
    fontWeight: "bold",
      margin: "auto",
      height: "auto",
      paddingTop : "5px",
      textAlign: "center",
  },
    logoIcon:{
	width: "50px",
	height: "auto",
	marginRight: "5px",
	marginTop: "16px",
	position : "absolute",
	top: "-19%",
	right: "1%",
	
    },
  nav: {
    display: "flex",
    gap: "20px",
      flexWrap: "wrap",
      marginTop: "10px",
      margin: "auto",
      borderBottom: "1px solid #475c42",
      borderRadius: "9px",
      padding: "5px",
      boxShadow: "1px 1px 1px green"
  },
  link: {
    background: "none",
    border: "none",
    color: Colors.textLight,
    fontWeight: "500",
    fontSize: "1rem",
      cursor: "pointer",
  },
};
