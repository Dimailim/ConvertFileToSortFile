import fs from 'fs';

function getSortChunksArray(chunk) {
    let previousChunk = '';
    let startSearch = previousChunk.length;
    const chunks = [];
    previousChunk += chunk;

    while (true) {
        const index = previousChunk.indexOf('\n', startSearch);
        // Если чанк дошел до конца, выходим из цикла
        if (index < 0) break;
        const line = previousChunk.slice(0, index + 1);
        //Если строка не пустая добавляем его в массив
        if (line.trim().length) {
            chunks.push(line);
        }
        // Убираем кусок добавленный в массив
        previousChunk = previousChunk.slice(index + 1)
        startSearch = 0;
    }
    // Cортируем полученный массив при помощи метода  sort
    chunks.sort((a,b) => {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    })
    // Возвращаем отсортированный массив
    return chunks;

}

try {
    // Для работы с большим файлами, потоки записи\чтения, являются самыми оптимальными.
    let readableSteam = fs.createReadStream('test.txt', 'utf-8');
    let writeableStream = fs.createWriteStream('sortFile.txt', 'utf-8');
    readableSteam.on('data', function (chunk) {
        // Получаем массив из отсортированных данных
        const sortChunks = getSortChunksArray(chunk);
        /*
         Извлекаем массив и записываем в новый файл отсортированные данные
         Для обработки больших данных, самый быстрый вариант перебора массива является массив for
         */
        for (let i = 0; i < sortChunks.length; i++) {
            writeableStream.write(sortChunks[i]);
        }
    })
} catch (e) {
    console.log('An error occurred while reading the file', e);
}