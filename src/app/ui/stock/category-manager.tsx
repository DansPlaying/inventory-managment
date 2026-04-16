'use client'

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { CiCirclePlus, CiEdit, CiTrash } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { createCategory, updateCategory, deleteCategory, CategoryState } from '@/app/lib/stock/actions';

function Spinner() {
  return <AiOutlineLoading3Quarters className="animate-spin" />;
}

type Category = {
  id: number;
  name: string;
};

type CategoryManagerProps = {
  categories: Category[];
};

export default function CategoryManager({ categories }: CategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex gap-2 border border-accentPrimary px-4 py-2 rounded-md font-semibold items-center transition-colors hover:bg-accentPrimary hover:text-white"
      >
        <span>Manage Categories</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-tertiary rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Categories</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setEditingCategory(null);
                  setIsAdding(false);
                }}
                className="text-2xl hover:text-red-500"
              >
                <IoClose />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isEditing={editingCategory?.id === category.id}
                  onEdit={() => setEditingCategory(category)}
                  onCancelEdit={() => setEditingCategory(null)}
                  onSuccess={() => setEditingCategory(null)}
                />
              ))}
            </div>

            {isAdding ? (
              <AddCategoryForm
                onCancel={() => setIsAdding(false)}
                onSuccess={() => setIsAdding(false)}
              />
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 text-accentPrimary hover:text-purple-400 transition-colors"
              >
                <CiCirclePlus className="text-xl" />
                <span>Add New Category</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CategoryItem({
  category,
  isEditing,
  onEdit,
  onCancelEdit,
  onSuccess,
}: {
  category: Category;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSuccess: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    const result = await deleteCategory(category.id);
    if (!result.success) {
      setDeleteError(result.message || 'Failed to delete');
    }
    setIsDeleting(false);
  };

  if (isEditing) {
    return (
      <EditCategoryForm
        category={category}
        onCancel={onCancelEdit}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <div className="flex flex-col p-3 bg-dark rounded-md">
      <div className="flex items-center justify-between">
        <span>{category.name}</span>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            disabled={isDeleting}
            className="text-xl hover:text-accentPrimary transition-colors disabled:opacity-50"
          >
            <CiEdit />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xl hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Spinner /> : <CiTrash />}
          </button>
        </div>
      </div>
      {deleteError && (
        <p className="text-red-500 text-sm mt-1">{deleteError}</p>
      )}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-accentPrimary rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {pending && <Spinner />}
      {label}
    </button>
  );
}

function CancelButton({ onClick, label = "Cancel" }: { onClick: () => void; label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="px-4 py-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function AddCategoryForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const initialState: CategoryState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createCategory, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={dispatch} className="space-y-2">
      <FormInput
        name="name"
        placeholder="Category name"
        autoFocus
      />
      {state.errors?.name && (
        <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
      )}
      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}
      <div className="flex gap-2">
        <SubmitButton label="Add" />
        <CancelButton onClick={onCancel} />
      </div>
    </form>
  );
}

function FormInput({ name, placeholder, defaultValue, autoFocus }: {
  name: string;
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      disabled={pending}
      autoFocus={autoFocus}
      className="w-full p-2 rounded-md bg-dark border border-border focus:border-accentPrimary focus:outline-none disabled:opacity-50"
    />
  );
}

function EditCategoryForm({
  category,
  onCancel,
  onSuccess,
}: {
  category: Category;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const initialState: CategoryState = { message: null, errors: {} };
  const updateCategoryWithId = updateCategory.bind(null, category.id);
  const [state, dispatch] = useFormState(updateCategoryWithId, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={dispatch} className="p-3 bg-dark rounded-md space-y-2">
      <FormInput
        name="name"
        defaultValue={category.name}
        autoFocus
      />
      {state.errors?.name && (
        <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
      )}
      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}
      <div className="flex gap-2">
        <SubmitButton label="Save" />
        <CancelButton onClick={onCancel} />
      </div>
    </form>
  );
}
