import { addToast } from "@heroui/toast";
import { Howl } from "howler";
import successSound from "../assets/sounds/success.mp3";
import alertSound from "../assets/sounds/error.mp3";

let soundEnabled = true;
export function enableToastSound(enable: boolean) {
  soundEnabled = enable;
}

export function useToast(
  message: any,
  color:
    | "danger"
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | undefined
) {
  let sound: Howl | null = null;
  if (color === "danger" || color === "warning") {
    sound = new Howl({ src: [alertSound] });
  } else if (color === "success") {
    sound = new Howl({ src: [successSound] });
  }

  let content: any;
  if (typeof message === "string") {
    if (message.includes("|")) {
      const items = message.split("|").map((item, idx) => (
        <li key={idx} className="mb-1 list-disc ml-1">
          {item.trim()}
        </li>
      ));
      content = <ul className="mt-1 text-xs font-body">{items}</ul>;
    } else {
      content = <span className="text-xs font-body">{message}</span>;
    }
  } else if (message instanceof Error) {
    content = <span className="text-xs font-body">{message.message}</span>;
  } else {
    content = <span className="text-xs font-body">{String(message)}</span>;
  }

  addToast({
    description: content,
    color: color,
    timeout: 3000,
  });

  if (soundEnabled && sound) {
    sound.play();
  }
}