import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MenuItem,
  DrinkItem,
  Allergy,
  CATEGORIES,
  MENU_ITEMS,
  DRINK_ITEMS,
  MORE_DRINK_ITEMS,
} from '../types';
import {
  saveImageCustomization,
  loadAllImageCustomizations,
  clearAllImageCustomizations,
  saveNewMenuItem,
  loadNewMenuItems,
  clearNewMenuItems,
} from '../utils/idb';

export interface UseMenuProps {
  setStatusMessage: (message: string) => void;
}

export const useMenu = ({ setStatusMessage }: UseMenuProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [drinkItems, setDrinkItems] = useState<DrinkItem[]>([]);
  const [moreDrinkItems, setMoreDrinkItems] = useState<DrinkItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedAllergies, setSelectedAllergies] = useState<Allergy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItemImage, setEditingItemImage] = useState<(MenuItem | DrinkItem) | null>(null);
  const [generatingModelForItem, setGeneratingModelForItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const initializeMenu = async () => {
      setIsMenuLoading(true);
      try {
        // 1. Start with the pristine base menu from code. This is now the protected source of truth.
        let loadedMenuItems = [...MENU_ITEMS];
        let loadedDrinkItems = [...DRINK_ITEMS];
        let loadedMoreDrinkItems = [...MORE_DRINK_ITEMS];

        // 2. Load all user customizations (image changes and new items) from the database.
        const imageCustomizations = await loadAllImageCustomizations();
        const newMenuItems = await loadNewMenuItems();

        // 3. Apply the user's saved image customizations on top of the base menu.
        const applyCustomizations = (items: (MenuItem | DrinkItem)[]) => {
          return items.map((item) =>
            imageCustomizations[item.id]
              ? { ...item, imageUrl: imageCustomizations[item.id] }
              : item
          );
        };

        loadedMenuItems = applyCustomizations(loadedMenuItems) as MenuItem[];
        loadedDrinkItems = applyCustomizations(loadedDrinkItems) as DrinkItem[];
        loadedMoreDrinkItems = applyCustomizations(loadedMoreDrinkItems) as DrinkItem[];

        // 4. Add the user's custom-created items to the menu.
        setMenuItems([...newMenuItems, ...loadedMenuItems]);
        setDrinkItems(loadedDrinkItems);
        setMoreDrinkItems(loadedMoreDrinkItems);
      } catch (error) {
        console.error('Error initializing menu:', error);
        setStatusMessage('Error al cargar el menú personalizado. Se usará la versión por defecto.');
        // Fallback to default menu in case of any DB error.
        setMenuItems(MENU_ITEMS);
        setDrinkItems(DRINK_ITEMS);
        setMoreDrinkItems(MORE_DRINK_ITEMS);
      } finally {
        setIsMenuLoading(false);
      }
    };
    initializeMenu();
  }, [setStatusMessage]);

  const filteredAndSortedMenuItems = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const items = menuItems.filter(
      (item) =>
        (selectedCategory === 'Todos' || item.category === selectedCategory) &&
        (selectedAllergies.length === 0 ||
          !item.allergens?.some((allergy) => selectedAllergies.includes(allergy))) &&
        (item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
    items.sort((a, b) => {
      const aIsCustom = a.id > 1000;
      const bIsCustom = b.id > 1000;
      if (aIsCustom && !bIsCustom) return -1;
      if (!aIsCustom && bIsCustom) return 1;
      return a.id - b.id;
    });
    return items;
  }, [selectedCategory, selectedAllergies, menuItems, searchTerm]);

  const filteredDrinkItems = useMemo(() => {
    return drinkItems.filter(
      (item) =>
        selectedAllergies.length === 0 ||
        !item.allergens?.some((a) => selectedAllergies.includes(a))
    );
  }, [selectedAllergies, drinkItems]);

  const filteredMoreDrinkItems = useMemo(() => {
    return moreDrinkItems.filter(
      (item) =>
        selectedAllergies.length === 0 ||
        !item.allergens?.some((a) => selectedAllergies.includes(a))
    );
  }, [selectedAllergies, moreDrinkItems]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAllergyToggle = (allergy: Allergy) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleUpdateItemImage = useCallback(
    async (itemId: number, newImageUrl: string, itemType: 'menu' | 'drink') => {
      // Optimistic UI update
      const updateState = (
        setter: React.Dispatch<React.SetStateAction<(MenuItem | DrinkItem)[]>>
      ) => {
        setter((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? { ...item, imageUrl: newImageUrl } : item))
        );
      };
      if (itemType === 'menu') {
        updateState(setMenuItems as React.Dispatch<React.SetStateAction<(MenuItem | DrinkItem)[]>>);
      } else {
        updateState(
          setDrinkItems as React.Dispatch<React.SetStateAction<(MenuItem | DrinkItem)[]>>
        );
        updateState(
          setMoreDrinkItems as React.Dispatch<React.SetStateAction<(MenuItem | DrinkItem)[]>>
        );
      }
      // Persist only this specific change
      try {
        await saveImageCustomization(itemId, newImageUrl);
      } catch (error) {
        console.error('Failed to save image customization', error);
        setStatusMessage('Error al guardar la imagen.');
      }
    },
    [setStatusMessage]
  );

  const handleUpdateMenuItemModel = (itemId: number, newModelUrl: string) => {
    const updatedItems = menuItems.map((item) =>
      item.id === itemId ? { ...item, modelUrl: newModelUrl } : item
    );
    setMenuItems(updatedItems);

    const updatedItemInModal = updatedItems.find((item) => item.id === itemId);
    if (updatedItemInModal) {
      setGeneratingModelForItem(updatedItemInModal);
    }
  };

  const handleResetMenu = useCallback(async () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres restaurar el menú a su estado original? Se perderán todas las imágenes y platos creados.'
      )
    ) {
      try {
        // Clear all customizations from persistence
        await clearAllImageCustomizations();
        await clearNewMenuItems();
        // Reset state to the default from code
        setMenuItems(MENU_ITEMS);
        setDrinkItems(DRINK_ITEMS);
        setMoreDrinkItems(MORE_DRINK_ITEMS);
        setStatusMessage('Menú restaurado a su estado original.');
      } catch (error) {
        console.error('Failed to reset menu:', error);
        setStatusMessage('Error al restaurar el menú.');
      }
    }
  }, [setStatusMessage]);

  const allEditableItems = useMemo(
    () => [...menuItems, ...drinkItems, ...moreDrinkItems],
    [menuItems, drinkItems, moreDrinkItems]
  );

  const canEditAnyImage = useMemo(
    () => allEditableItems.some((item) => !!item.imageUrl),
    [allEditableItems]
  );

  const handleOpenImageEditor = (item?: MenuItem | DrinkItem) => {
    if (item) {
      setEditingItemImage(item);
    } else {
      const firstEditable = allEditableItems.find((i) => !!i.imageUrl);
      if (firstEditable) {
        setEditingItemImage(firstEditable);
      }
    }
  };

  const handleNavigateToNextItem = () => {
    if (!editingItemImage) return;
    const currentIndex = allEditableItems.findIndex(
      (item) => item.id === editingItemImage.id && item.name === editingItemImage.name
    );
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % allEditableItems.length;
      setEditingItemImage(allEditableItems[nextIndex]);
    }
  };

  const handleNavigateToPrevItem = () => {
    if (!editingItemImage) return;
    const currentIndex = allEditableItems.findIndex(
      (item) => item.id === editingItemImage.id && item.name === editingItemImage.name
    );
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + allEditableItems.length) % allEditableItems.length;
      setEditingItemImage(allEditableItems[prevIndex]);
    }
  };

  const handleAddGeneratedItem = useCallback(
    async (itemData: { name: string; description: string; price: number; imageUrl: string }) => {
      const newItem: MenuItem = {
        id: Date.now(),
        category: 'IA',
        ...itemData,
      };
      // Optimistic UI Update
      setMenuItems((prevItems) => [newItem, ...prevItems]);
      // Persist new item
      try {
        await saveNewMenuItem(newItem);
      } catch (error) {
        console.error('Failed to save new menu item', error);
        setStatusMessage('Error al guardar el nuevo plato.');
      }
    },
    [setStatusMessage]
  );

  const handleOpenModelGenerator = (item: MenuItem) => {
    setGeneratingModelForItem(item);
  };

  return {
    isMenuLoading,
    menuItems,
    drinkItems,
    moreDrinkItems,
    filteredAndSortedMenuItems,
    filteredDrinkItems,
    filteredMoreDrinkItems,
    selectedCategory,
    selectedAllergies,
    searchTerm,
    setSearchTerm,
    editingItemImage,
    generatingModelForItem,
    canEditAnyImage,
    handleSelectCategory,
    handleAllergyToggle,
    handleUpdateItemImage,
    handleUpdateMenuItemModel,
    handleResetMenu,
    handleOpenImageEditor,
    handleNavigateToNextItem,
    handleNavigateToPrevItem,
    handleAddGeneratedItem,
    handleOpenModelGenerator,
  };
};
