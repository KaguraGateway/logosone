type Props = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function Switch(props: Props) {
    return (
        <label>
            <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
            <span>{props.label}</span>
        </label>
    );
}
