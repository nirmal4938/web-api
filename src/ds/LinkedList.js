class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Add to end (O(n))
  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = newNode;
    }
    this.size++;
  }

  // Get node at index (O(n) - NO RANDOM ACCESS!)
  getNodeAt(index) {
    if (index < 0 || index >= this.size) return null;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  // Linear search (O(n))
  linearSearch(target) {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.value === target) return index;
      current = current.next;
      index++;
    }
    return -1;
  }
}


// Binary search on linked list - O(n) per middle access → O(n log n) total!
function binarySearchLinkedList(list, target) {
  let left = 0;
  let right = list.size - 1;
  let steps = 0;

  while (left <= right) {
    steps++;
    const mid = Math.floor((left + right) / 2);
    
    // ⚠️ THIS IS THE PROBLEM: O(mid) traversal to reach middle node
    const midNode = list.getNodeAt(mid); // O(n) operation!
    
    if (midNode.value === target) {
      console.log(`Found in ${steps} steps (but ${mid} traversals to reach middle)`);
      return mid;
    } else if (midNode.value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

function binarySearchArray(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let steps = 0;

  while (left <= right) {
    steps++;
    const mid = Math.floor((left + right) / 2);
    
    // ✅ O(1) random access via index
    if (arr[mid] === target) {
      console.log(`Found in ${steps} steps`);
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

// Setup
const list = new LinkedList();
const arr = [];
for (let i = 1; i <= 1000; i++) {
  list.append(i);
  arr.push(i);
}

console.log("=== Searching for 750 ===");

// Linked list binary search (inefficient)
console.time("LinkedList Binary Search");
binarySearchLinkedList(list, 750);
console.timeEnd("LinkedList Binary Search");
// Output: ~10 steps BUT ~3750 node traversals total!

// Array binary search (efficient)
console.time("Array Binary Search");
binarySearchArray(arr, 750);
console.timeEnd("Array Binary Search");
// Output: ~10 steps with 10 O(1) accesses

// Linked list linear search (often faster in practice!)
console.time("LinkedList Linear Search");
list.linearSearch(750);
console.timeEnd("LinkedList Linear Search");
// Output: 750 steps but NO repeated traversals