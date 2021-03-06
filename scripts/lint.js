/*
 *     Web Config
 *     Copyright (C) 2020 Craig Miller
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { ESLint } = require('eslint');
const path = require('path');
const { requireEslintConfig } = require('../utils/requireConfigs');
const tsSetup = require('../typescript/tssetup');

const execute = async () => {
    console.log('Running eslint validation');
    tsSetup(false);

    const eslint = new ESLint({
        errorOnUnmatchedPattern: false,
        baseConfig: requireEslintConfig(),
        useEslintrc: false,
        fix: true,
        fixTypes: [
            'problem',
            'suggestion',
            'layout'
        ]
    });

    const results = await eslint.lintFiles([
        path.resolve(process.cwd(), 'src'),
        path.resolve(process.cwd(), 'test'),
        path.resolve(process.cwd(), 'cypress')
    ]);
    await ESLint.outputFixes(results);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    if (resultText.length > 0) {
        console.log(resultText);
        process.exit(1);
    }
};

execute()
    .catch((error) => {
        process.exitCode = 1;
        console.error(error);
    });
