import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface EditorPanelProps {
  selectedElement: {
    tagName: string;
    className: string;
    text: string;
    styles: {
      padding: string;
      margin: string;
      backgroundColor: string;
      color: string;
      fontSize: string;
    };
  } | null;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export default function EditorPanel({
  selectedElement,
  onUpdate,
  onClose,
}: EditorPanelProps) {
  const [values, setValues] = useState(selectedElement);

  const handleChange = (field: string, value: string) => {
    let newValues = { ...values, [field]: value };
    if (field in values?.styles) {
      newValues.styles = { ...values?.styles, [field]: value };
    }
    setValues(newValues);
    onUpdate({ [field]: value });
  };

  const handleStyleChange = (styleName: string, value: string) => {
    let newStyles = { ...values?.styles, [styleName]: value };
    setValues({ ...values, styles: newStyles });
    onUpdate({ styles: { [styleName]: value } });
  };

  useEffect(() => {
    setValues(selectedElement);
  }, [selectedElement]);

  if (!selectedElement || !values) return null;

  return (
    <div className="absolute top-4 right-4  w-80 rounded-lg bg-white shadow-xl border border-gray-200 animate-fade-in fade-in p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-800 font-semibold">Edit Element</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <XIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      <div className="space-y-4 text-black">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-700">
            Text Content
          </label>
          <textarea
            value={values.text}
            onChange={(e) => handleChange("text", e.target.value)}
            className="w-full text-xs p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-20"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">
            ClassName
          </label>
          <input
            type="text"
            value={values.className || ""}
            onChange={(e) => handleChange("className", e.target.value)}
            className="w-full text-sm border-gray-400 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">
              Padding
            </label>
            <input
              type="text"
              value={values.styles.padding}
              onChange={(e) => handleStyleChange("padding", e.target.value)}
              className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">
              Margin
            </label>
            <input
              type="text"
              value={values.styles.margin}
              onChange={(e) => handleStyleChange("margin", e.target.value)}
              className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">
              Font Size
            </label>
            <input
              type="text"
              value={values.styles.fontSize}
              onChange={(e) => handleStyleChange("fontSize", e.target.value)}
              className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">
              Background
            </label>
            <div className="flex items-center gap-2 rounded-md border border-gray-400 p-1">
              <input
                type="color"
                value={
                  values.styles.backgroundColor === "rgba(0,0,0,0)"
                    ? "#ffffff"
                    : values.styles.backgroundColor
                }
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
                className="w-6 h-6 cursor-pointer"
              />
              <span className="text-xs text-gray-600 truncate">
                {values.styles.backgroundColor}
              </span>
            </div>
          </div>{" "}
          {/* <-- ye line add karo, Background wrapper close */}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">
              Text Color
            </label>
            <div className="flex items-center gap-2 rounded-md border border-gray-400 p-1">
              <input
                type="color"
                value={values.styles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="w-6 h-6 cursor-pointer"
              />
              <span className="text-xs text-gray-600 truncate">
                {values.styles.color}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
