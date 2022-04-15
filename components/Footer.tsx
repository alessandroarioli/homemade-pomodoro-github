import {FunctionComponent} from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";


export const Footer: FunctionComponent = () => (
  <footer className={styles.footer}>
    <a
      href="https://lastminute.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by{' '}
      <Image
        src="https://res.cloudinary.com/lastminute-contenthub/image/upload/v1573571662/DAM/Logos%20%2B%20fonts/lastminutecom/Icon_lm.com.png"
        alt="Logo"
        width={"40"}
        height={"40"}
      />
    </a>
  </footer>
)