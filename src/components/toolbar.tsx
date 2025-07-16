'use client';

import { useState, useRef, ElementRef } from 'react';
import { Doc } from '../../convex/_generated/dataModel';
import { IconPicker } from '@/components/icon-picker';
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';
import { ImageIcon, Smile, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Props {
  initialData: Doc<'documents'>;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: Props) => {
  const removeIcon = useMutation(api.documents.removeIcon);
  const update = useMutation(api.documents.update);

  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const disableInput = () => setIsEditing(false);
  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };
  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || 'Untitled',
    });
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };
  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  return (
    <div className={'pl-[54px] group relative'}>
      {!!initialData.icon && !preview && (
        <div className={'flex items-center gap-x-2 pt-5 group/icon'}>
          <IconPicker onChange={onIconSelect}>
            <p className={'text-6xl transition hover:opacity-75'}>
              {initialData?.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className={'text-6xl pt-6'}>{initialData.icon}</p>
      )}
      <div className="flex items-center gap-x-1 py-2 group-hover:opacity-100 md:opacity-0">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm"
            >
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={() => {}}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          spellCheck="false"
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="break-words pb-[.7188rem] text-5xl font-bold  text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};
