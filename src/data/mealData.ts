import { MealOption } from '../types';

export const MEAL_OPTIONS: MealOption[] = [
  {
    id: 'meal-none',
    name: 'No Meal',
    description: 'Complimentary water and light beverage service only',
    price: 0,
    isVegetarian: true,
    dietaryTag: 'Standard',
  },
  {
    id: 'meal-veg',
    name: 'Vegetarian Meal',
    description: 'Fresh paneer curry, spiced lentils, steamed basmati rice & dessert',
    price: 150,
    isVegetarian: true,
    dietaryTag: 'Vegetarian',
  },
  {
    id: 'meal-nonveg',
    name: 'Non-Vegetarian Meal',
    description: 'Tender chicken curry, seasoned vegetables, aromatic rice & sweet treat',
    price: 200,
    isVegetarian: false,
    dietaryTag: 'Poultry',
  },
  {
    id: 'meal-vegan',
    name: 'Vegan Meal',
    description: 'Plant-based seasonal harvest bowl with quinoa, sautéed greens & fruit',
    price: 180,
    isVegetarian: true,
    dietaryTag: '100% Plant-Based',
  },
  {
    id: 'meal-jain',
    name: 'Jain Meal',
    description: 'Prepared strictly without root vegetables, onion or garlic, with cumin rice',
    price: 170,
    isVegetarian: true,
    dietaryTag: 'Jain Friendly',
  },
];

