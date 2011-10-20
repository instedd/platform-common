require 'smart_asset'
require 'fileutils'
require 'right_aws'

DISTRIBUTION_ID = 'E3L595KW7W8HK9'

task :default => [:all]

task :all => [:css, :js] do
end

task :js do
  puts "compressing js"
  SmartAsset.load_config Dir.pwd, 'assets.yml'
  SmartAsset.compress 'javascripts'
  Dir["#{Dir.pwd}/theme/javascripts/temp/*.js"].each do |filename|
    target_filename = filename.sub(/\/temp\/.*_/, '/')
    puts "Moving to #{target_filename}"
    FileUtils.move filename, filename.sub(/\/temp\/.*_/, '/')
  end
  puts "Removing temp folder"
  Dir.delete "#{Dir.pwd}/theme/javascripts/temp"
end

task :css do
  output_css = "#{Dir.pwd}/theme/stylesheets/theme.css"
  File.delete(output_css) if File::exists?(output_css)

  puts "compressing css"
  puts `compass compile`
end

task :deploy => [:all, :sample_index, :build_zip, :upload, :invalidate]

task :sample_index do
  puts "building samples/index.htm"

  hg_tip = `hg tip`.strip
  hg_version = hg_tip.match("^changeset:.*:(.*)$")[1]

  file = File.new("samples/index.htm", "w+")
  file.puts "<!DOCTYPE HTML><html><body><h1>InSTEDD Platform Common</h1><pre>#{hg_tip}</pre>"
  file.puts "<a href=\"http://code.google.com/p/instedd-platform-common/source/detail?r=#{hg_version}\">source on google code</a>"
  file.puts "<ul>"

  Dir["#{Dir.pwd}/samples/**/*.htm"].sort.each do |filename|
    filename.sub!("#{Dir.pwd}/samples/", "")
    next if filename == "index.htm"
    file.puts "<li><a href=\"#{filename}\">#{filename}</a>"
  end

  file.puts "</ul></body></html>"
  file.close
end

task :build_zip => :all do
  puts "building theme/theme.zip"
  `zip -r theme/theme.zip theme/ -x theme/theme.zip *sass* *.DS_Store *javascripts/source/*`
end

task :upload  do
  # be sure to have exported these keys
  # export AWS_ACCESS_KEY_ID=yourS3accesskey
  # export AWS_SECRET_ACCESS_KEY=yourS3secretkey
  puts "uploading to s3"
  ['samples','theme'].each do |folder|
    puts %x[s3sync -v --public-read --recursive --exclude="\.DS_Store|sass|javascripts/source" --cache-control="public,max-age=3600" --delete #{folder}/ theme.instedd.org:#{folder}]
  end
  puts "done"
end

task :invalidate do
  puts "invalidating cloudfront paths"
  acf = RightAws::AcfInterface.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])

  # fixed paths to invalidate
  paths_to_invalidate = ['/theme/javascripts/theme.js', '/theme/stylesheets/theme.css']

  # files in sample to invalidate
  Dir["#{Dir.pwd}/samples/**/*.*"].each do |filename|
    paths_to_invalidate << filename.sub("#{Dir.pwd}", "")
  end

  acf.create_invalidation DISTRIBUTION_ID, :path => paths_to_invalidate
end
