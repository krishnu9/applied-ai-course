import { Prose as ProseText } from "@/components/ui";

export type ProseProps =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: readonly string[] };

/** One paragraph or one list from a lesson block, inside the shell Prose wrapper. */
export function Prose(props: ProseProps) {
  if (props.kind === "paragraph") {
    return (
      <ProseText>
        <p>{props.text}</p>
      </ProseText>
    );
  }

  const Tag = props.ordered ? "ol" : "ul";
  return (
    <ProseText>
      <Tag>
        {props.items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </Tag>
    </ProseText>
  );
}
