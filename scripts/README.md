# Memos API Test Scripts

This directory contains curl scripts for testing the Memos API.

## Preparation

1. Make sure you have set up the `.env` file in the project root directory, including the following variables:

   ```text
   MEMOS_URL=https://your-memos-instance.com
   MEMOS_API_KEY=your_api_key_here
   MEMOS_TIMEOUT=15000
   ```

2. Run the permissions setup script:

   ```bash
   cd scripts
   ./setup_permissions.sh
   ```

## Available Scripts

### Get User ID

```bash
./get_user_id.sh
```

### Search Memos

```bash
./search_memo.sh <keyword>
```

Example:

```bash
./search_memo.sh "todo"
```

### Create Memo

```bash
./create_memo.sh <content> [tags] [visibility]
```

Example:

```bash
./create_memo.sh "This is a test memo" "#test #memo" "PRIVATE"
```

### Get Specific Memo

```bash
./get_memo.sh <memoID>
```

Example:

```bash
./get_memo.sh 123
# or
./get_memo.sh memos/123
```

## Notes

- All scripts depend on `setup.sh` to load environment variables. Please ensure the `.env` file is set up correctly.
- The default visibility is PRIVATE. Available options include PUBLIC, PROTECTED, and PRIVATE.
- Make sure you have sufficient permissions to perform these API operations.
