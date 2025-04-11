# Introduction

You are going to build Transaction system for an office where Account Manager will be Managing Daily Expenses for Cash Inflow / Outflow.

## Details

There will be two screens as following:

### 1. Office Transactions Grid

with 5 columns Date, Description, Credit, Debit & Running Balance should be displayed as following and Sorting should be done in such a way that latest transactions should come on the top.

### Notes

- Running balance should be the balance that is remaining in the account.
- Example:
  - First entry (on 17 Feb) from the bottom in the table above is showing that 5000 have been credited to Office account so balance is 5k.
  - On 18 Feb, There was an expense of 500 on snacks party so entry should be 500 to Debit column and running balance is now 4500.
  - On 18 Feb, there is another expense of printing sheets worth 285, so running balance is 4215.
  - On 20 Feb, There are some misc. expense worth 300 so now the running balance should be 1215.

### 2. Add Transaction Page

When user clicks on “+ Add Transaction Page” it will show the “New Transaction Page”.

#### Transaction type

will be dropdown with one option can be selected at one time (Credit/Debit), Amount & Description should be required field.

#### On Click of Save

it will create new transaction record in Database and redirect to Office Transactions page
