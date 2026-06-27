let ops = 0;
function resetOps() { ops = 0; }

// Insertion Sort

function insertionSort(arr) {
  let a = [...arr]; // copy (just for safety)
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;

    while (j >= 0 && (++ops && a[j] > key)) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// best case
resetOps();
insertionSort([1,2,3,4,5]);
console.log(ops); // ~ n

// worst case
resetOps();
insertionSort([5,4,3,2,1]);
console.log(ops); // ~ n²


// Selection Sort
function selectionSort(arr) {
  let a = [...arr];
  let n = a.length;

  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      ops++;
      if (a[j] < a[min]) min = j;
    }
    [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}

resetOps();
selectionSort([1,2,3,4,5]);
console.log(ops); // n²

resetOps();
selectionSort([5,4,3,2,1]);
console.log(ops); // n²

// Bubble Sort
function bubbleSort(arr) {
  let a = [...arr];
  let n = a.length;

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      ops++;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // optimization
  }
  return a;
}

resetOps();
bubbleSort([1,2,3,4,5]);
console.log(ops); // ~ n

resetOps();
bubbleSort([5,4,3,2,1]);
console.log(ops); // ~ n²


// merge sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    ops++;
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

resetOps();
mergeSort([5,4,3,2,1]);
console.log(ops); // ~ n log n

resetOps();
mergeSort([1,2,3,4,5]);
console.log(ops); // ~ n log n

// quick sort
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  let pivot = arr[arr.length - 1];
  let left = [], right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    ops++;
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
// worst case
resetOps();
quickSort([1,2,3,4,5]);
console.log(ops); // ~ n²

// Average Case
resetOps();
quickSort([3,1,4,5,2]);
console.log(ops); // ~ n log n

// Heap Sort
function heapSort(arr) {
  let a = [...arr];
  let n = a.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(a, n, i);

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(a, i, 0);
  }
  return a;
}

function heapify(a, n, i) {
  let largest = i;
  let l = 2*i + 1;
  let r = 2*i + 2;

  if (l < n && (++ops && a[l] > a[largest])) largest = l;
  if (r < n && (++ops && a[r] > a[largest])) largest = r;

  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    heapify(a, n, largest);
  }
}

resetOps();
heapSort([5,1,4,2,3]);
console.log(ops); // ~ n log n




