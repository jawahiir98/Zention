'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useParams } from 'next/navigation';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

export const CoverImageModal = () => {
  const params = useParams();
  const coverImage = useCoverImage();
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();

  const onClose = () => {
    setFile(undefined);
    setSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });

      onClose();
    }
  };
  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogTitle>
        <span className="sr-only">Change Cover Image</span>
      </DialogTitle>
      <DialogContent>
        <DialogHeader>
          <span className="text-center text-lg font-semibold">Cover Image</span>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
