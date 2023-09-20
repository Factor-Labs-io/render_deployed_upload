import { Hero } from "@/components";
import styles from "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <Hero />
      <ToastContainer />
    </main>
  );
}
