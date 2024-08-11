import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:80/api/users/login\?key\=foo-bar-baz\&id\=5537\&user\=testuser\&role\=admin');
  await page.locator('a h3').first().click();
  const url = page.url();
  const id = url.split('/').pop();

  console.log('Current URL:', page.url());

  await page.getByRole('button', { name: 'Order' }).click();
  await page.waitForTimeout(1000); // wait for the whole form to load
  await page.getByRole('img', { name: 'Account' }).click();
  await page.waitForTimeout(2000); // wait for the whole form to load
  await page.getByRole('list').getByText('Order History').click();

  await page.locator('.detail-button').first().click();
  await page.waitForTimeout(1000); // wait for the whole form to load
  const productIDElement = page.locator('#productID');
  await page.waitForTimeout(1000); // wait for the whole form to load
  await expect(productIDElement).toHaveText(new RegExp(`Product ID: ${id}`)); // 断言文本包含正确的 Product ID
});

test('edit listing', async ({ page }) => {

  await page.goto('http://127.0.0.1:80/api/users/login\?key\=foo-bar-baz\&id\=5537\&user\=testuser\&role\=admin');
  await page.getByRole('img', { name: 'Account' }).click();
  await page.getByText('My Listings').click();
  await page.getByRole('button', { name: 'Go to Detail' }).first().click();
  
  // get the :id from url
  const url = page.url();
  const id = url.split('/').pop();
  console.log('id:', id);
  await page.goto('http://127.0.0.1:80/edit-listing/' + id);

  await page.waitForSelector('label[for="address-line-1"]'); 
  await page.waitForTimeout(5000); // wait for the whole form to load
  await page.getByLabel('Product name').fill('edited version 2');
  await page.getByRole('button', { name: 'Submit' }).click();
   // locate the product name header
   const productNameHeader = page.locator('.product-name > h2');
   // check if the product name is updated
   await expect(productNameHeader).toHaveText('Product Name: edited version 3');
});


