import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";


interface EditorPanelProps {
    seletedElement: {
        tagName: string;
        className: string;
        text : string;
        styles : {
            padding : string,
            margin: string,
            backgroundColor: string,
            Color: string,
            fontSize: string,
        }
    } | null;
    onUpdate: (updates: any)=> void;
    onClose: ()=> void;
}

export default function EditorPanel({seletedElement, onUpdate, onClose}: EditorPanelProps) {
    
    const [values, setValues] = useState(seletedElement)
    
    const handleChange = (field:string, value: string) => {
        let newValues = {...values, [field]: value};
        if (field in values?.styles) {
            newValues.styles = {...values?.styles, [field]: value};
        }
        setValues(newValues);
        onUpdate({[field]: value})
    }

    const handleStyleChange = (styleName:string, value:string) => {
        let newStyles = {...values?.styles, [styleName]: value}
    }

    useEffect(()=> {
        setValues(seletedElement);
    }, [seletedElement]);

    if (!seletedElement || !values) return null;

    return (
        <div className="absolute top-4 right-4 w-80 rounded-lg bg-white shadow-xl border border-gray-200 animate-in fade-in p-4 z-50 slide-in-from-right-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold">Edit Element</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                    <XIcon className="h-4 w-4 text-gray-500"/>
                </button>
            </div>
            <div className="space-y-4 text-black">
                <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        Text Content
                    </label>
                    <textarea  value={values.text} onChange={(e) => handleChange('text', e.target.value)}
                        className="w-full text-xs p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-20" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1 text-gray-500">
                        ClassName
                    </label>
                    <input type="text" value={values.className || ""} onChange={(e) => handleChange('className', e.target.value)}
                        className="w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500">
                          Padding
                      </label>
                      <input type="text" value={values.className || ""} onChange={(e) => handleStyleChange('className', e.target.value)}
                        className="w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                    </div>
                </div>
            </div>
        </div>
    )
}