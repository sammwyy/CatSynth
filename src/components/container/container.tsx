import { PropsWithChildren } from "react";

import styles from "./container.module.css";

export default function Container({ children }: PropsWithChildren) {
  return <div className={styles["container"]}>{children}</div>;
}
